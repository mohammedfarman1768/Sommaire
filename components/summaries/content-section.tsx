import { parseEmojiPoint, parsePoint } from '@/utils/summary-helper';
import { MotionDiv } from '../common/motion-wrapper';
import { containerVariants, itemVariants } from '@/utils/constants';

type EmojiPointProps = {
  point: string;
};

const EmojiPoint = ({ point }: EmojiPointProps) => {
  const parsed = parseEmojiPoint(point);
  if (!parsed) return null;

  const { emoji, text } = parsed;

  return (
    <MotionDiv
      viewport={{ once: true }}
      variants={itemVariants}
      className="group relative rounded-2xl border border-gray-500/10 bg-linear-to-br from-gray-200/[0.08] to-gray-400/[0.03] p-4 transition-all hover:shadow-lg"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-gray-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start gap-3">
        <span className="shrink-0 pt-1 text-lg lg:text-xl">{emoji}</span>
        <p className="text-muted-foreground/90 text-lg leading-relaxed lg:text-xl">
          {text}
        </p>
      </div>
    </MotionDiv>
  );
};

type RegularPointProps = {
  point: string;
};

const RegularPoint = ({ point }: RegularPointProps) => {
  return (
    <MotionDiv
      viewport={{ once: true }}
      variants={itemVariants}
      className="group relative rounded-2xl border border-gray-500/10 bg-linear-to-br from-gray-200/[0.08] to-gray-400/[0.03] p-4 transition-all hover:shadow-lg"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-gray-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <p className="text-muted-foreground/90 relative text-left text-lg leading-relaxed lg:text-xl">
        {point}
      </p>
    </MotionDiv>
  );
};

type ContentSectionProps = {
  title: string;
  points: string[];
};

export default function ContentSection({ title, points }: ContentSectionProps) {
  return (
    <MotionDiv
      viewport={{ once: true }}
      variants={containerVariants}
      key={points.join('')}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      {title && (
        <h2 className="text-2xl font-semibold text-white/90 mb-4 lg:text-3xl">
          {title}
        </h2>
      )}
      {points.map((point, index) => {
        const { isMainPoint, hasEmoji, isEmpty } = parsePoint(point);

        if (isEmpty) return null;

        if (hasEmoji || isMainPoint) {
          return <EmojiPoint key={`point-${index}`} point={point} />;
        }

        return <RegularPoint key={`point-${index}`} point={point} />;
      })}
    </MotionDiv>
  );
}
