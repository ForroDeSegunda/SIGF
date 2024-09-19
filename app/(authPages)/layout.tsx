import tw from "tailwind-styled-components";
import MainModal from "../components/MainModal";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { readClasses } from "./classes/actions";
import { readPeriods } from "./periods/actions";
import { readUserWithRole } from "./users/actions";
import { readThreads } from "./threads/actions";
import { Content } from "./content";

const Main = tw.main`flex-bg-white w-full h-dvh flex flex-col`;
const Container = tw.div`flex h-[calc(100dvh-4rem)]`;

export default async function PagesLayout(props: {
  children: React.ReactNode;
}) {
  const classes = await readClasses();
  const periods = await readPeriods();
  const threads = await readThreads();
  const user = await readUserWithRole();

  return (
    <Main>
      <MainModal />
      <Navbar />
      <Container>
        <Sidebar />
        <Content
          user={user}
          classes={classes}
          periods={periods}
          threads={threads}
        >
          {props.children}
        </Content>
      </Container>
    </Main>
  );
}
