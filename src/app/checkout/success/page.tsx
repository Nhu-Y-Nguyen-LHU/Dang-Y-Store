import CheckoutSuccessClient from './CheckoutSuccessClient';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderCode = searchParams.order ?? 'DY-—';
  return <CheckoutSuccessClient orderCode={orderCode} />;
}
