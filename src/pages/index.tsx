import Button from "../components/button";

export default function Home(props: { message: string }) {
  return (
    <div>
      <h1>Welcome to Bunfire! {props.message}</h1>
      <p>Bun handles JSX and TSX seamlessly!</p>
      <Button />
    </div>
  );
}
