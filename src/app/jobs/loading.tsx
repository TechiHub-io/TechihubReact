import BouncingCirclesLoader from "@/components/animations/BouncingCircleLoader"
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <p className="text-center">
    <BouncingCirclesLoader />
  </p>
}