import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export const Inline = ({ children }: { children: string }) => (
  <InlineMath math={children} />
);

export const Block = ({ children }: { children: string }) => (
  <div className="my-3 mx-auto max-w-lg bg-muted/60 border border-border rounded-lg py-3 px-5 text-center">
    <BlockMath math={children} />
  </div>
);
