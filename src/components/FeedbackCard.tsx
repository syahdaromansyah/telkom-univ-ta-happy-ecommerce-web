import { format } from 'date-fns';

interface FeedbackCardProps {
  fullname: string;
  feedbackDate: string;
  feedbackText: string;
}

export default function FeedbackCard({
  fullname,
  feedbackDate,
  feedbackText,
}: FeedbackCardProps) {
  return (
    <article>
      <div className="rounded-md bg-zinc-800 py-2 px-3">
        <h3 className="mb-1 font-poppins text-lg font-bold lg:text-xl">
          {fullname}
        </h3>

        <p className="mb-2 font-semibold">
          Diulas pada{' '}
          <time dateTime={feedbackDate}>
            {format(new Date(feedbackDate), 'dd-MM-yyyy, HH:mm:ss')}
          </time>
        </p>

        <p>{feedbackText}</p>
      </div>
    </article>
  );
}
