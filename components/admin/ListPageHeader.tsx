import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LucideIcon, Loader2 } from 'lucide-react';
import { fadeInDown, buttonHover, buttonTap } from '@/lib/animations';

interface ListPageHeaderProps {
  title: string;
  description: string;
  actionLabel: string;
  actionIcon: LucideIcon;
  onAction: () => void;
  animate?: boolean;
  actionLoading?: boolean;
}

export const ListPageHeader: React.FC<ListPageHeaderProps> = ({
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  animate = true,
  actionLoading = false,
}) => {
  const content = (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <motion.div whileHover={actionLoading ? {} : buttonHover} whileTap={actionLoading ? {} : buttonTap}>
        <Button onClick={onAction} className="gap-2" disabled={actionLoading}>
          {actionLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ActionIcon className="h-4 w-4" />
          )}
          {actionLabel}
        </Button>
      </motion.div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        variants={fadeInDown}
        initial="hidden"
        animate="show"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};
