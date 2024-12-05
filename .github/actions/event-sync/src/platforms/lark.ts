import axios from 'axios';
import * as core from '@actions/core';

import { type NotificationMessage, type NotificationPlatform } from '../types';

export class LarkPlatform implements NotificationPlatform {
  constructor(
    private webhookUrl: string,
    private personOpenIds?: Record<string, string>,
  ) {}

  private getPerson(personName: string) {
    return this.personOpenIds?.[personName]
      ? `<at id=${this.personOpenIds[personName]}></at>`
      : personName;
  }

  private formatMessage(message: NotificationMessage) {
    return {
      msg_type: 'interactive',
      card: {
        header: {
          title: {
            tag: 'plain_text',
            content: message.title,
          },
        },
        elements: [
          {
            tag: 'div',
            fields: [
              {
                is_short: false,
                text: {
                  tag: 'lark_md',
                  content: message.content,
                },
              },
            ],
          },
          message.url
            ? {
                tag: 'action',
                actions: [
                  {
                    tag: 'button',
                    text: {
                      tag: 'plain_text',
                      content: 'View Details',
                    },
                    type: 'primary',
                    url: message.url,
                  },
                ],
              }
            : {},
          message.creator
            ? {
                tag: 'note',
                elements: [
                  {
                    tag: 'lark_md',
                    content: `creator: ${this.getPerson(message.creator)}`,
                  },
                ],
              }
            : {},
        ],
      },
    };
  }

  async send(message: NotificationMessage): Promise<void> {
    try {
      const formattedMessage = this.formatMessage(message);
      const res = await axios.post(this.webhookUrl, formattedMessage);
      console.log(res.data);
    } catch (error) {
      core.setFailed(
        `Failed to send message to Lark: ${error as Error}.message`,
      );
    }
  }
}
