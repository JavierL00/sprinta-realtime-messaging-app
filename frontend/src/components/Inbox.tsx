import {useCallback, useEffect, useState} from "react";
import {useAuthStore} from "../store/auth";
import Loading from "./Loading";
import {ContactType} from "../interface/contactType";
import {defaultContact} from "../data/contacts";
import Contacts from "./Contacts";
import Chat from "./Chat";
import {useInfiniteQuery} from "@tanstack/react-query";
import supabase from "../lib/supabase";
import {Toaster, toast} from 'sonner';

export default function Inbox() {
	const [selectedContact, setSelectedContact] = useState<ContactType>(defaultContact);
	const {loading, fetchMessages, fetchContacts, getUserById} = useAuthStore();
	const limit: number = 30;

	const useRealtimeMessages = (onNewMessage: any) => {
		useEffect(() => {
			const subscription = supabase
			.channel('messages')
			.on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'messages'}, (payload) => {
				onNewMessage(payload.new);
			})
			.subscribe();

			return () => {
				supabase.removeChannel(subscription);
			};
		}, [onNewMessage]);
	};

	useRealtimeMessages(async (newMessage: any) => {
		const sender = await getUserById(newMessage.sender_id);
		toast(`${sender.user.name}: ${newMessage.content}`);
	});

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["messages", selectedContact.id],
		queryFn: async ({pageParam = 1}) => {
			const messages = await fetchMessages(selectedContact.id, pageParam, limit);
			return messages.reverse();
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < limit) return undefined;
			return allPages.length + 1;
		},
		staleTime: 1000 * 60 * 5,
		retry: 3,
	});

	const messages = data?.pages.flat().reverse() || [];

	const handleSelectContact = useCallback(async (contact: ContactType) => {
		setSelectedContact(contact);
	}, []);

	useEffect(() => {
		fetchContacts();
	}, [fetchContacts]);

	if (loading) {
		return <Loading/>;
	}

	return (
	 <div className="h-svh p-8">
		 <div className="border-4 bg-white w-full h-full overflow-hidden rounded-xl">
			 <div className="flex h-full overflow-hidden">
				 <Contacts handleSelectContact={handleSelectContact} selectedContact={selectedContact}/>
				 <Chat
					isLoading={isLoading}
					selectedContact={selectedContact}
					messages={messages}
					fetchNextPage={fetchNextPage}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
				 />
				 <Toaster/>
			 </div>
		 </div>
	 </div>
	);
}
