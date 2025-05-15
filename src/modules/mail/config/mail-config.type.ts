export type MailConfig = {
  port: number;
  host?: string;
  user?: string;
  password?: string;
  from: string;
  // defaultName?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
};
