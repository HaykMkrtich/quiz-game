export default function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  return <div>Dang!</div>;
}
