import GrandTestResultScreen from './GrandTestResultScreen';

export default function ImageBasedTestResultScreen({
  result,
  testTitle = 'IBT 4',
  userName,
  onBack,
  onReviewQuestions,
}) {
  return (
    <GrandTestResultScreen
      variant="imageBased"
      result={result}
      testTitle={testTitle}
      userName={userName}
      onBack={onBack}
      onReviewQuestions={onReviewQuestions}
    />
  );
}
