/* eslint-disable no-console */
import { LoggerAdapter, LoggerAdapterConfig, LogMessage } from './LoggerAdapter';
import HttpAdapterFactory, { HttpAdapter } from '@luckbox/http-adapter-factory';

type Config = LoggerAdapterConfig & {
  webhookId: string,
  token: string,
  regex: RegExp,
}

export default class DiscordLoggerAdapter extends LoggerAdapter {
  private apiUrl: string;
  private webhookId: string;
  private token: string;
  private regex: RegExp;
  private httpClient: HttpAdapter;

  constructor(params: Config) {
    super(params);

    this.apiUrl = 'discord.com/api';
    this.webhookId = params.webhookId;
    this.token = params.token;
    this.regex = params.regex;
    this.httpClient = new HttpAdapterFactory().create({});
  }

  public log(message: LogMessage): void {
    const formattedMessageArray  = this.formatMessage(message);

    if (formattedMessageArray.find((fmessage) => this.regex.test(fmessage))) {
      this.publish(formattedMessageArray.join(' '));
    }
  }

  private publish(message: string) {
    try {
      return this.httpClient.post<unknown>(`${this.apiUrl}/${this.webhookId}/${this.token}`, {
        'content': message,
      });
    } catch (err) {
      console.log('Something when wrong', err);
    }
  }

  private formatMessage(message: LogMessage) {
    let formattedArgs = [];
    if (!this.skipTimestamps) {
      formattedArgs.push(this.formatDate(message.date));
    }
    if (message.prefix !== undefined) {
      formattedArgs.push(`[${message.prefix}]`);
    }
    formattedArgs.push(`[${message.level.toUpperCase()}]`);

    formattedArgs = [
      ...formattedArgs,
      ...message.args.map((anArg) => this.serializeDataIfNecessary(anArg)),
    ];

    return formattedArgs;
  }
}

export {
  Config as DiscordAdapterConfig,
};
