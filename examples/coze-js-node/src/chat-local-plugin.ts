/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChatEventType,
  RoleType,
  type StreamChatData,
  type ToolCallType,
  type ToolOutputType,
} from '@coze/api';

import { client, botId } from './client.js';

// local-plugin(端插件使用示例）)
// see more : https://www.coze.cn/open/docs/guides/local_plugin_overview
async function chatWithLocalPlugin() {
  const result = await client.chat.stream({
    bot_id: botId,
    auto_save_history: true,
    additional_messages: [
      {
        role: RoleType.User,
        content: '深圳天气',
        content_type: 'text',
      },
    ],
  });
  await handleStream(result);
}

async function handleStream(result: AsyncIterable<StreamChatData>) {
  for await (const event of result) {
    if (event.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
      if (event.data.type === 'answer') {
        console.log('answer', event.data.content);
      }
    } else if (
      event.event === ChatEventType.CONVERSATION_CHAT_REQUIRES_ACTION
    ) {
      console.log(
        'required_action',
        JSON.stringify(event.data.required_action, null, 2),
      );
      if (
        !event.data.required_action ||
        !event.data.required_action.submit_tool_outputs
      ) {
        continue;
      }
      const { submit_tool_outputs } = event.data.required_action;
      const { tool_calls } = submit_tool_outputs;
      const toolOutputs: ToolOutputType[] = [];
      for (const toolCall of tool_calls) {
        toolOutputs.push({
          tool_call_id: toolCall.id,
          output: JSON.stringify(mockToolOutput(toolCall)),
        });
      }
      console.log('toolOutputs', toolOutputs);
      const submitToolOutputsResult = await client.chat.submitToolOutputs(
        {
          conversation_id: event.data.conversation_id,
          chat_id: event.data.id,
          auto_save_history: true,
          tool_outputs: toolOutputs,
          stream: true,
        },
        {
          transformResponse: [
            function (data: any, headers: any) {
              // get logid from headers
              // only work in node environment
              console.log('logid', headers['x-tt-logid']);
              return data;
            },
          ],
        },
      );

      await handleStream(submitToolOutputsResult);
    }
  }
}

function mockToolOutput(toolCall: ToolCallType) {
  // get_current_temperature is the local plugin name
  if (toolCall.function.name === 'get_current_temperature') {
    // input is the input of the local plugin, e.g {"input":"深圳"}
    const args = JSON.parse(toolCall.function.arguments);
    return {
      output: `${args?.input}:多云；气温13-18℃；东北风3级`,
    };
  }
  return {
    output: 'Unknown tool',
  };
}

chatWithLocalPlugin().catch(console.error);
