export class JiraIssueTypeDto {
  id?: string;
  name?: string;
  iconUrl?: string;
  subtask?: boolean;
}

export class JiraIssueDto {
  id!: number;
  jiraId!: string;
  key!: string;
  projectKey!: string;
  summary!: string;
  status!: any;
  issueType!: JiraIssueTypeDto | string;
  priority!: any;
  assignee!: any;
  sprint!: any;
  storyPoints!: number;
  created!: string;
  updated!: string;
  createdAt!: string;
  updatedAt!: string;
}

export class JiraIssueListResponseDto {
  startAt!: number;
  maxResults!: number;
  total!: number;
  issues!: JiraIssueDto[];
}

export class JiraSyncDto {
  projectKey!: string;
  defaultSprint!: string;
  issueTypes!: string[];
}

export class JiraSyncResponseDto {
  message!: string;
  syncedCount!: number;
}

export { JiraSyncResponseDto as JiraSyncResponse };

export interface JiraIssueQuery {
  projectKey?: string;
  sprint?: string;
  issueTypes?: string[];
  maxResults?: number;
  startAt?: number;
}
