export default function CalendarFrame(props: { src: string }) {
  return <iframe className="w-full h-full p-4 flex-1" src={props.src} />;
}
