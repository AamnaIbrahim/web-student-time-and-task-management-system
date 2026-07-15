import Spinner from "./Spinner";

function LoadingState() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner />
    </div>
  );
}

export default LoadingState;