export interface ProjectInfoResp {
  data: {
    icon_url: string;
    name: string;
  };
}

export interface BackgroundImageResp {
  theme_color?: string;
  gradient_position?: {
    left?: number;
    right?: number;
  };
  canvas_position?: {
    width?: number;
    height?: number;
    left?: number;
    top?: number;
  };
  image_url?: string;
  origin_image_url?: string;
}
export interface WorkflowInfoResp {
  role?: {
    avatar?: {
      image_uri?: string;
      image_url?: string;
    };
    description?: string;
    name?: string;
    background_image_info?: {
      web_background_image?: BackgroundImageResp;
      mobile_background_image: BackgroundImageResp;
    };
    id: string;
    connector_id: string;
    suggest_reply_info?: {
      suggest_reply_mode?: number;
      customized_suggest_prompt?: string;
    };
    audio_config?: {
      is_text_to_voice_enable?: boolean;
      voice_config_map?: Record<
        string,
        {
          voice_id: string;
          name: string;
        }
      >;
      AgentMessageType: 2;
    };
    workflow_id: string;
    onboarding_info: {
      prologue: string;
      display_all_suggestions: boolean;
      suggested_questions: string[];
    };
    user_input_config?: {
      default_input_mode: number;
    };
  };
}
