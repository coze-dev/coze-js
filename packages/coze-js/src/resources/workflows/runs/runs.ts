import { APIResource } from '../../resource';
import { CozeError } from '../../../error';
import { type RequestOptions } from '../../../core';

export class Runs extends APIResource {
  /**
   * Initiates a workflow run. | 启动工作流运行。
   * @docs en: https://www.coze.com/docs/developer_guides/workflow_run?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/workflow_run?_lang=zh
   * @param params.workflow_id - Required The ID of the workflow to run. | 必选 要运行的工作流 ID。
   * @param params.bot_id - Optional The ID of the bot associated with the workflow. | 可选 与工作流关联的机器人 ID。
   * @param params.parameters - Optional Parameters for the workflow execution. | 可选 工作流执行的参数。
   * @param params.ext - Optional Additional information for the workflow execution. | 可选 工作流执行的附加信息。
   * @param params.execute_mode - Optional The mode in which to execute the workflow. | 可选 工作流执行的模式。
   * @param params.connector_id - Optional The ID of the connector to use for the workflow. | 可选 用于工作流的连接器 ID。
   * @param params.app_id - Optional The ID of the app.  | 可选 要进行会话聊天的 App ID
   * @returns RunWorkflowData | 工作流运行数据
   */
  async create(
    params: RunWorkflowReq & { is_async: true },
    options?: RequestOptions,
  ): Promise<RunWorkflowAsyncData>;
  async create(
    params: RunWorkflowReq & { is_async?: false },
    options?: RequestOptions,
  ): Promise<RunWorkflowSyncData>;
  async create(
    params: RunWorkflowReq,
    options?: RequestOptions,
  ): Promise<RunWorkflowData>;
  async create(params: RunWorkflowReq, options?: RequestOptions) {
    const apiUrl = '/v1/workflow/run';
    const response = await this._client.post<RunWorkflowReq, RunWorkflowData>(
      apiUrl,
      params,
      false,
      options,
    );
    return response;
  }
  /**
   * Streams the workflow run events. | 流式传输工作流运行事件。
   * @docs en: https://www.coze.com/docs/developer_guides/workflow_stream_run?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/workflow_stream_run?_lang=zh
   * @param params.workflow_id - Required The ID of the workflow to run. | 必选 要运行的工作流 ID。
   * @param params.bot_id - Optional The ID of the bot associated with the workflow. | 可选 与工作流关联的机器人 ID。
   * @param params.parameters - Optional Parameters for the workflow execution. | 可选 工作流执行的参数。
   * @param params.ext - Optional Additional information for the workflow execution. | 可选 工作流执行的附加信息。
   * @param params.execute_mode - Optional The mode in which to execute the workflow. | 可选 工作流执行的模式。
   * @param params.connector_id - Optional The ID of the connector to use for the workflow. | 可选 用于工作流的连接器 ID。
   * @param params.app_id - Optional The ID of the app.  | 可选 要进行会话聊天的 App ID
   * @returns Stream<WorkflowEvent, { id: string; event: string; data: string }> | 工作流事件流
   */
  async *stream(
    params: Omit<RunWorkflowReq, 'is_async'>,
    options?: RequestOptions,
  ) {
    const apiUrl = '/v1/workflow/stream_run';
    const result = await this._client.post<
      RunWorkflowReq,
      AsyncGenerator<{ id: string; event: WorkflowEventType; data: string }>
    >(apiUrl, params, true, options);

    for await (const message of result) {
      try {
        if (message.event === WorkflowEventType.DONE) {
          yield new WorkflowEvent(Number(message.id), WorkflowEventType.DONE);
        } else {
          yield new WorkflowEvent(
            Number(message.id),
            message.event,
            JSON.parse(message.data),
          );
        }
      } catch (error) {
        throw new CozeError(
          `Could not parse message into JSON:${message.data}`,
        );
      }
    }
  }
  /**
   * Resumes a paused workflow run. | 恢复暂停的工作流运行。
   * @docs en: https://www.coze.com/docs/developer_guides/workflow_resume?_lang=en
   * @docs zh: https://www.coze.cn/docs/developer_guides/workflow_resume?_lang=zh
   * @param params.workflow_id - Required The ID of the workflow to resume. | 必选 要恢复的工作流 ID。
   * @param params.event_id - Required The ID of the event to resume from. | 必选 要从中恢复的事件 ID。
   * @param params.resume_data - Required Data needed to resume the workflow. | 必选 恢复工作流所需的数据。
   * @param params.interrupt_type - Required The type of interruption to resume from. | 必选 要恢复的中断类型。
   * @returns AsyncGenerator<WorkflowEvent, { id: string; event: string; data: string }> | 工作流事件流
   */
  async *resume(params: ResumeWorkflowReq, options?: RequestOptions) {
    const apiUrl = '/v1/workflow/stream_resume';

    const result = await this._client.post<
      ResumeWorkflowReq,
      AsyncGenerator<{ id: string; event: WorkflowEventType; data: string }>
    >(apiUrl, params, true, options);

    for await (const message of result) {
      try {
        if (message.event === WorkflowEventType.DONE) {
          yield new WorkflowEvent(Number(message.id), WorkflowEventType.DONE);
        } else {
          yield new WorkflowEvent(
            Number(message.id),
            message.event,
            JSON.parse(message.data),
          );
        }
      } catch (error) {
        throw new CozeError(
          `Could not parse message into JSON:${message.data}`,
        );
      }
    }
  }

  /**
   * Get the workflow run history | 工作流异步运行后，查看执行结果
   * @docs zh: https://www.coze.cn/open/docs/developer_guides/workflow_history
   * @param workflowId - Required The ID of the workflow. | 必选 工作流 ID。
   * @param executeId - Required The ID of the workflow execution. | 必选 工作流执行 ID。
   * @returns WorkflowExecuteHistory[] | 工作流执行历史
   */
  async history(
    workflowId: string,
    executeId: string,
    options?: RequestOptions,
  ) {
    const apiUrl = `/v1/workflows/${workflowId}/run_histories/${executeId}`;
    const response = await this._client.get<
      undefined,
      { data: WorkflowExecuteHistory[] }
    >(apiUrl, undefined, false, options);
    return response.data;
  }
}

export interface RunWorkflowReq {
  workflow_id: string;
  bot_id?: string;
  parameters?: Record<string, unknown>;
  ext?: Record<string, string>;
  app_id?: string;
  is_async?: boolean;
}

// Token usage of a workflow run.
// 工作流运行的 Token 消耗。
export interface RunWorkflowUsage {
  // Tokens consumed by the input, including context, system prompts, and the current user input.
  // 输入内容所消耗的 Token 数，包含对话上下文、系统提示词、用户当前输入等所有输入类的 Token 消耗。
  input_count: number;

  // Tokens consumed by the model output.
  // 大模型输出的内容所消耗的 Token 数。
  output_count: number;

  // Total tokens consumed by this API call, including input and output.
  // 本次 API 调用消耗的 Token 总量，包括输入和输出两部分的消耗。
  token_count: number;
}

// Request detail returned by the workflow run API.
// 工作流运行请求的详细信息，主要用于记录日志 ID。
export interface RunWorkflowDetail {
  // Log ID of this request.
  // 本次请求的日志 ID。
  logid: string;
}

// Parameter definition required when a workflow run is interrupted.
// 工作流中断时需要补充的参数定义。
export interface RunWorkflowInterruptParameter {
  // Parameter type, such as string, number, image, object, or array.
  // 参数类型，例如 string、number、image、object、array。
  type?: string;

  // Element schema when type is array.
  // 参数类型为 array 时，数组元素的子类型。
  items?: RunWorkflowInterruptParameter;

  // Whether the parameter is required.
  // 该参数是否必填。
  required?: boolean;

  // Nested properties when type is object.
  // 参数类型为 object 时的子参数定义。
  properties?: Record<string, RunWorkflowInterruptParameter>;

  // Parameter description.
  // 参数描述。
  description?: string;

  // Configured default value.
  // 参数配置的默认值。
  default_value?: string;
}

// Interrupt payload returned by a non-streaming workflow run.
// 非流式执行工作流时返回的中断信息。
export interface RunWorkflowInterrupt {
  // Interrupt control content.
  // 中断控制内容。
  data: string;

  // Interrupt type. Pass this back when resuming the workflow.
  // 工作流中断类型，恢复运行时应回传此字段。
  // 2: question node, 5: input node, 6: client plugin, 7: OAuth plugin.
  // 2：问答节点，5：输入节点，6：端插件，7：OAuth 插件。
  type: number;

  // Interrupt event ID. Pass this back when resuming the workflow.
  // 工作流中断事件 ID，恢复运行时应回传此字段。
  event_id: string;

  // Parameters that must be supplied to resume the interrupted workflow.
  // 工作流中断时需要补充的参数信息。
  required_parameters?: Record<string, RunWorkflowInterruptParameter>;
}

// Synchronous workflow run response. | 同步执行工作流的响应。
export interface RunWorkflowSyncData {
  // Status code. 0 means the call succeeded.
  // 调用状态码。0 表示调用成功。
  code: number;

  // Status message. Empty when code is 0.
  // 状态信息。API 调用失败时可通过此字段查看详细错误信息。
  msg: string;

  // Workflow execution result, usually a JSON serialized string.
  // 工作流执行结果，通常为 JSON 序列化字符串，部分场景下可能返回非 JSON 结构的字符串。
  data: string;

  // Debug page for this run. The link expires after 7 days.
  // 工作流试运行调试页面。访问有效期为 7 天。
  debug_url: string;

  // Token usage of this API call.
  // 资源使用情况，包含本次 API 调用消耗的 Token 数量等信息。
  usage?: RunWorkflowUsage;

  // Request detail, mainly the log ID for troubleshooting.
  // 请求详细信息，主要用于记录日志 ID 以便排查问题。
  detail?: RunWorkflowDetail;

  // Event ID. Present when the run is asynchronous.
  // 异步执行的事件 ID。
  execute_id?: string;

  // Interrupt details when the workflow pauses for user input or a plugin.
  // 中断事件的详细信息。
  interrupt_data?: RunWorkflowInterrupt;
}

// Asynchronous workflow run response. | 异步执行工作流的响应。
export interface RunWorkflowAsyncData {
  // Event ID of the asynchronous execution.
  // 异步执行的事件 ID。
  execute_id: string;

  // Debug page for this run. The link expires after 7 days.
  // 工作流试运行调试页面。访问有效期为 7 天。
  debug_url?: string;

  // Status message. Empty when the call succeeded.
  // 状态信息。API 调用失败时可通过此字段查看详细错误信息。
  msg?: string;

  // Status code. 0 means the call succeeded.
  // 调用状态码。0 表示调用成功。
  code?: number;

  // Request detail, mainly the log ID for troubleshooting.
  // 请求详细信息，主要用于记录日志 ID 以便排查问题。
  detail?: RunWorkflowDetail;

  // Not returned until the asynchronous run is queried via history.
  // 异步运行的执行结果需通过查询异步执行结果接口获取。
  data?: string;

  // Token usage of this API call, when the service includes it.
  // 资源使用情况。异步运行时通常不返回。
  usage?: RunWorkflowUsage;

  // Interrupt details when the workflow pauses for user input or a plugin.
  // 中断事件的详细信息。
  interrupt_data?: RunWorkflowInterrupt;
}

// Response of POST /v1/workflow/run.
// 执行工作流接口的响应。同步与异步返回的字段不同，因此取二者的并集。
export type RunWorkflowData = RunWorkflowSyncData | RunWorkflowAsyncData;

export interface ResumeWorkflowReq {
  workflow_id: string;
  event_id: string;
  resume_data: string;
  interrupt_type: number;
}

export enum WorkflowEventType {
  // The output message from the workflow node, such as the output message from
  // the message node or end node. You can view the specific message content in data.
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
  error_message: string;
}

export interface WorkflowExecuteHistory {
  execute_id: string;
  execute_status: 'Success' | 'Running' | 'Fail';
  bot_id: string;
  connector_id: string;
  connector_uid: string;
  run_mode: 0 | 1 | 2;
  logid: string;
  create_time: number;
  update_time: number;
  output: string;
  token: string;
  cost: string;
  error_code: string;
  error_message: string;
  debug_url: string;
}

export class WorkflowEvent {
  // The event ID of this message in the interface response. It starts from 0.
  id: number;

  // The current streaming data packet event.
  event: WorkflowEventType;

  // The current streaming data packet event.
  data?: WorkflowEventMessage | WorkflowEventInterrupt | WorkflowEventError;

  constructor(
    id: number,
    event: WorkflowEventType,
    data?: WorkflowEventMessage | WorkflowEventInterrupt | WorkflowEventError,
  ) {
    this.id = id;
    this.event = event;
    this.data = data;
  }
}
