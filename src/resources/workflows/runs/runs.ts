import Stream from '../../../stream.js';
import { safeJsonParse } from '../../../utils.js';
import { APIResource } from '../../resource.js';

export class Runs extends APIResource {
  async create(params: RunWorkflowReq) {
    const apiUrl = `/v1/workflow/run`;
    const response = await this._client.post<RunWorkflowReq, RunWorkflowData>(apiUrl, params);
    return response;
  }
  async stream(params: RunWorkflowReq) {
    const apiUrl = `/v1/workflow/stream_run`;
    const response = await this._client.post<RunWorkflowReq, Response>(apiUrl, params, true);

    return new Stream<WorkflowEvent, { id: string; event: string; data: string }>(
      response.body as ReadableStream,
      {
        id: 'id:',
        event: 'event:',
        data: 'data:',
      },
      message => {
        if (message.event === WorkflowEventType.DONE) {
          return new WorkflowEvent(Number(message.id), WorkflowEventType.DONE);
        } else {
          return new WorkflowEvent(Number(message.id), WorkflowEventType.MESSAGE, safeJsonParse(message.data));
        }
      },
    );
  }

  async resume(params: ResumeWorkflowReq) {
    const apiUrl = `/v1/workflow/stream_resume`;
    const response = await this._client.post<
      ResumeWorkflowReq,
      {
        id: string;
        event: WorkflowEventType;
        data: WorkflowEventMessage | WorkflowEventInterrupt | WorkflowEventError | null;
      }
    >(apiUrl, params);
    return response;
  }
}

export interface RunWorkflowReq {
  workflow_id: string;
  bot_id?: string;
  parameters?: Record<string, unknown>;
  ext?: Record<string, string>;
}

export interface RunWorkflowData {
  data: string;
  cost: string;
  token: number;
  debug_url: string;
}

export interface ResumeWorkflowReq {
  workflow_id: string;
  event_id: string;
  resume_data: string;
  interrupt_type: number;
}

export enum WorkflowEventType {
  // The output message from the workflow node, such as the output message from
  // the message node or end node. You can view the specific message content in data.
  // 工作流节点输出消息，例如消息节点、结束节点的输出消息。可以在 data 中查看具体的消息内容。
  MESSAGE = 'Message',

  // An error has occurred. You can view the error_code and error_message in data to
  // troubleshoot the issue.
  // 报错。可以在 data 中查看 error_code 和 error_message，排查问题。
  ERROR = 'Error',

  // End. Indicates the end of the workflow execution, where data is empty.
  // 结束。表示工作流执行结束，此时 data 为空。
  DONE = 'Done',

  // Interruption. Indicates the workflow has been interrupted, where the data field
  // contains specific interruption information.
  // 中断。表示工作流中断，此时 data 字段中包含具体的中断信息。
  INTERRUPT = 'Interrupt',
}

interface WorkflowRunResult {
  debug_url: string;
  data: string;
}

export interface WorkflowEventMessage {
  // The content of the streamed output message.
  // 流式输出的消息内容。
  content: string;

  // The name of the node that outputs the message, such as the message node or end node.
  // 输出消息的节点名称，例如消息节点、结束节点。
  node_title: string;

  // The message ID of this message within the node, starting at 0, for example, the 5th message of the message node.
  // 此消息在节点中的消息 ID，从 0 开始计数，例如消息节点的第 5 条消息。
  node_seq_id: string;

  // Whether the current message is the last data packet for this node.
  // 当前消息是否为此节点的最后一个数据包。
  node_is_finish: boolean;

  // Additional fields.
  // 额外字段。
  ext?: Record<string, unknown>;
}

interface WorkflowEventInterruptData {
  // The workflow interruption event ID, which should be passed back when resuming the workflow.
  // 工作流中断事件 ID，恢复运行时应回传此字段。
  event_id: string;

  // The type of workflow interruption, which should be passed back when resuming the workflow.
  // 工作流中断类型，恢复运行时应回传此字段。
  type: number;
}

export interface WorkflowEventInterrupt {
  // The content of interruption event.
  // 中断控制内容。
  interrupt_data: WorkflowEventInterruptData;

  // The name of the node that outputs the message, such as "Question".
  // 输出消息的节点名称，例如“问答”。
  node_title: string;
}

export interface WorkflowEventError {
  // Status code. 0 represents a successful API call. Other values indicate that the call has failed. You can
  // determine the detailed reason for the error through the error_message field.
  // 调用状态码。0 表示调用成功。其他值表示调用失败。你可以通过 error_message 字段判断详细的错误原因。
  error_code: number;

  // Status message. You can get detailed error information when the API call fails.
  // 状态信息。API 调用失败时可通过此字段查看详细错误信息。
  error_message: string;
}

export class WorkflowEvent {
  // The event ID of this message in the interface response. It starts from 0.
  id: number;

  // The current streaming data packet event.
  event: WorkflowEventType;

  message?: WorkflowEventMessage;

  interrupt?: WorkflowEventInterrupt;

  error?: WorkflowEventError;

  constructor(id: number, event: WorkflowEventType, message?: WorkflowEventMessage, interrupt?: WorkflowEventInterrupt, error?: WorkflowEventError) {
    this.id = id;
    this.event = event;
    this.message = message;
    this.interrupt = interrupt;
    this.error = error;
  }
}
