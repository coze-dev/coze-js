export interface Branches {
  current: string;
  target: string;
}

export enum PublishType {
  ALPHA = 'alpha',
  BETA = 'beta',
  STABLE = 'stable',
}

export interface DiffFileInfo {
  path: string;
  to_path: string;
  to_sha: string;
  to_mode: number;
  change_type: string;
  binary: boolean;
  lines_inserted: number;
}

export interface PatchProtectRulesParams {
  push_access_level?: string;
  merge_access_level?: string;
  branch_name_pattern?: string;
  override_review_rules?: boolean;
  check_required?: boolean;
  code_owner_review_required?: boolean;
  review_rule_ids?: number[];
  work_item_link_required?: boolean;
  app_settings?: Record<string, unknown>;
}

export interface Repository {
  id: number;
  name: string;
  platform: string;
  external_id: string;
  external_url: string;
  git_url: string;
  groot_node_id?: string;
  resolve_outdated_threads: boolean;
  only_allow_submit_if_all_threads_are_resolved: boolean;
  squash: string;
  remove_source_branch: boolean;
  create_change_lark_task_enabled: boolean;
  auto_close_referenced_issues_on_default_branch_enabled: boolean;
  approve_later_changes_enabled: boolean;
  created_at: string;
  git_ssh_url: string;
  git_http_url: string;
  git_repo_updated_at: string;
  type: string;
  level: string;
  status: string;
  description: string;
  is_monorepo: boolean;
}

export interface ProtectRule {
  id: number;
  repository: Repository;
  target_id: number;
  target_type: number;
  branch_name_pattern: string;
  check_required: boolean;
  review_required: boolean;
  code_owner_review_required: boolean;
  work_item_link_required: boolean;
  merge_access_level: string;
  push_access_level: string;
  override_review_rules: boolean;
  created_at: string;
  updated_at: string;
  app_settings: Record<string, unknown>[];
}

export interface BranchProtectionRules {
  branch_protection_rules: ProtectRule[];
}
