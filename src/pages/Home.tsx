import { useState, Fragment, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import {
  useNewMessageSubscription,
  GetContactsQuery,
  useGetCurrentUserQuery,
  GetChatsQuery,
  useLogoutMutation,
  GetChatsDocument,
  useGetChatLazyQuery,
} from "../generated/graphql";

import ChatSection from "../containers/ChatSection";
import Sidebar from "../containers/Sidebar";
import ChatPlaceholder from "../components/ChatPlaceholder";
import QueryResult from "../components/QueryResult";
import ContactsTab from "../containers/ContactsTab";
import AddGroupParticipants from "../containers/AddGroupParticipants";
import CreateGroup from "../containers/CreateGroup";
import EditProfile from "../containers/EditProfile";
import TabContainer from "../components/TabContainer";
import SearchUsers from "../containers/SearchUsers";
import HomePageContainer from "../components/HomePageContainer";
import HomeSidebarContainer from "../components/HomeSidebarContainer";
import HomeChatContainer from "../components/HomeChatContainer";

export type ContactType = GetContactsQuery["getContacts"][0];

const Home: React.FC = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const { data, loading, error } = useGetCurrentUserQuery();
  const [chatId, setChatId] = useState<null | number>(null);
  const [selectedContacts, setSelectedContacts] = useState<ContactType[]>([]);
  const [selectedChat, setSelectedChat] =
    useState<GetChatsQuery["getChats"][0]>();
  const [tab, setTab] = useState(1);
  const [getChatQuery, { data: newChatData }] = useGetChatLazyQuery();
  const [
    logout,
    { data: logoutData, loading: logoutLoading, error: logoutError },
  ] = useLogoutMutation();

  useNewMessageSubscription({
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData?.data?.newMessage && data?.currentUser) {
        const newMessage = subscriptionData.data.newMessage;

        const chatData = client.readQuery({
          query: GetChatsDocument,
        });

        if (chatData) {
          const getChats = chatData.getChats;
          const chatIsNotInCache =
            getChats.filter(
              (chat: GetChatsQuery["getChats"][0]) =>
                Number(chat.id) === Number(newMessage.chatId)
            ).length === 0;

          if (!getChats || chatIsNotInCache) {
            getChatQuery({
              variables: {
                chatId: subscriptionData?.data?.newMessage.chatId,
                limit: 1,
              },
            });
          }
        }
      }
    },
  });

  useEffect(() => {
    if (newChatData) {
      const { getChats } = client.readQuery({ query: GetChatsDocument });

      const chatIsNotInCache =
        getChats.filter(
          (chat: GetChatsQuery["getChats"][0]) =>
            Number(chat.id) === Number(newChatData.getChat.id)
        ).length === 0;

      if (chatIsNotInCache) {
        client.writeQuery({
          query: GetChatsDocument,
          data: { getChats: [newChatData.getChat, ...getChats] },
        });
      }
    }
  }, [newChatData, client]);

  const handleClick = (selectedChatId: number) => {
    setChatId(selectedChatId);
  };

  const handleTabChange = (tabNumber: number) => {
    setTab(tabNumber);
  };

  const handleSetChat = (chat: GetChatsQuery["getChats"][0]) => {
    setSelectedChat(chat);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <HomePageContainer>
      <QueryResult
        error={error || logoutError}
        loading={loading || logoutLoading}
      >
        {data?.currentUser && (
          <Fragment>
            <HomeSidebarContainer>
              <TabContainer tabIn={tab === 1}>
                <Sidebar
                  currentUser={data.currentUser}
                  toContactsTab={() => handleTabChange(2)}
                  toEditProfileTab={() => handleTabChange(5)}
                  toSearchUsers={() => handleTabChange(6)}
                  handleClick={handleClick}
                  chatId={chatId}
                  handleSetChat={handleSetChat}
                  handleLogout={handleLogout}
                />
              </TabContainer>

              <TabContainer tabIn={tab === 2}>
                <ContactsTab
                  selectChat={handleClick}
                  backToSidebar={() => handleTabChange(1)}
                  toGroupParticipants={() => handleTabChange(3)}
                />
              </TabContainer>

              <TabContainer tabIn={tab === 3}>
                <AddGroupParticipants
                  toContactsTab={() => handleTabChange(2)}
                  toCreateGroup={() => handleTabChange(4)}
                  selectedContacts={selectedContacts}
                  setSelectedContacts={setSelectedContacts}
                />
              </TabContainer>

              <TabContainer tabIn={tab === 4}>
                <CreateGroup
                  toGroupParticipants={() => handleTabChange(3)}
                  selectedContacts={selectedContacts}
                  selectChat={handleClick}
                  backToSidebar={() => handleTabChange(1)}
                  setSelectedContacts={setSelectedContacts}
                />
              </TabContainer>

              <TabContainer tabIn={tab === 5}>
                <EditProfile backToSidebar={() => handleTabChange(1)} />
              </TabContainer>

              <TabContainer tabIn={tab === 6}>
                <SearchUsers backToSidebar={() => handleTabChange(1)} />
              </TabContainer>
            </HomeSidebarContainer>

            <HomeChatContainer>
              {chatId && selectedChat ? (
                <ChatSection
                  chatId={chatId}
                  chat={selectedChat}
                  userId={Number(data.currentUser.id)}
                />
              ) : (
                <ChatPlaceholder />
              )}
            </HomeChatContainer>
          </Fragment>
        )}
      </QueryResult>
    </HomePageContainer>
  );
};

export default Home;
