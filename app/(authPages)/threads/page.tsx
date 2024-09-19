import tw from "tailwind-styled-components";

const Container = tw.div`flex w-full`;
const Content = tw.div`flex w-full`;

export default function ForumPage() {
  return (
    <Container>
      <Content className="flex w-full justify-center m-4 bg-red-600">
        <div className="bg-fuchsia-600 max-w-3xl w-full">oisdufosidufsod</div>
      </Content>
    </Container>
  );
}
