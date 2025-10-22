export interface FilterConfig {
  key: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  width?: string;
}