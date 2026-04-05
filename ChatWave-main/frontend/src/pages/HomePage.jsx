import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOutGoingFriendReqs,
  getRecommendedUser,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import FriendCard, { getLanguageFlag } from "../component/FriendCard";
import NoFriends from "../component/NoFriends";
const HomePage = () => {
  const queryClient = useQueryClient();
  const [outGoingRequestIds, setOutGoingRequestIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });
  const { data: recommendedUser = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUser,
  });
  const { data: outGoingFriendReqs } = useQuery({
    queryKey: ["outGoingFriendReqs"],
    queryFn: getOutGoingFriendReqs,
  });

 const { mutate: sendRequestMutation } = useMutation({
  mutationFn: sendFriendRequest,
  onMutate: (userId) => {
    setPendingUserId(userId);
    setOutGoingRequestIds((prev) => new Set(prev).add(userId)); // Optimistically add
  },
  onSettled: () => setPendingUserId(null),
  onSuccess: () =>
    queryClient.invalidateQueries({ queryKey: ["outGoingFriendReqs"] }),
});

  useEffect(() => {
    const outgoingIds = new Set();
    if (outGoingFriendReqs && outGoingFriendReqs.length > 0) {
      outGoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutGoingRequestIds(outgoingIds);
    }
  }, [outGoingFriendReqs]);

   const [pendingUserId, setPendingUserId] = useState(null);

  


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="conatiner mx-auto space-y-10">
        <div className="flex flex-col rounded-4xl sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notification" className="btn btn-outline btn-sm">
            <UserIcon className="mr-2 size-4" />
            Friends Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-dots loading-lg" />
          </div>
        ) : friends.length == 0 ? (
          <NoFriends />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8 ">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Friends
                </h2>
                <p className="opacity-70">Discover perfect langauge Partner.</p>
              </div>
            </div>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-dots loading-lg" />
            </div>
          ) : recommendedUser.length == 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new partner
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedUser.map((user) => {
                const hasRequestBeenSent = outGoingRequestIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 ">
                        <span className="badge badge-secondary ">
                          {getLanguageFlag(user.nativeLangauge)}
                          Native:{capitialize(user.nativeLangauge)}
                        </span>
                        <span className="badge badge-secondary ">
                          {getLanguageFlag(user.learningLangauge)}
                          Learning:{capitialize(user.learningLangauge)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}
                      <button
            className={`btn w-full mt-2 ${
              hasRequestBeenSent ? "btn-disabled" : "btn-primary"
            }`}
            onClick={() => sendRequestMutation(user._id)}
            disabled={hasRequestBeenSent || pendingUserId === user._id}
          >
            {pendingUserId === user._id ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Sending...
              </>
            ) : hasRequestBeenSent ? (
              <>
                <CheckCircleIcon className="size-4 mr-2" />
                Request Sent
              </>
            ) : (
              <>
                <UserPlusIcon className="size-4 mr-2" />
                Send Friend Request
              </>
            )}
          </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
