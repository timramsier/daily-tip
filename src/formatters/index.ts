import { Tip } from '../loaders';
import { PoisonTipFormatter } from './poison-formatter';
import { MarkdownTipFormatter } from './markdown-formatter';
import { ShellTipFormatter } from './shell-formatter';
import { HtmlTipFormatter } from './html-formatter';

export interface TipFormatter<T> {
  formatTip(tip: Tip, categoryTitle?: string): T;
}

export default {
  PoisonTipFormatter,
  MarkdownTipFormatter,
  ShellTipFormatter,
  HtmlTipFormatter,
};
