export const BUCKET = 'car-csv-bucket';
export const UPLOADED_DIR = 'uploaded';
export const PARSED_DIR = 'parsed';

export enum QUEUE_MESSAGE {
  QUEUE_SUCCESS = 'Message is sent',
  PARSE_ERROR = "The file can't be parsed",
  ERROR = "There's error when it try to send message",
}
