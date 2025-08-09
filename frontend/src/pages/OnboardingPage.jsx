import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import toast from "react-hot-toast";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();

  const [formState, setformState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLangauge: authUser?.nativeLangauge || "",
    learningLangauge: authUser?.learningLangauge || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const queryClient = useQueryClient();

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError:(error)=>{
      toast.error(error.response.data.message)
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar=()=>{
    const idx = Math.floor(Math.random()*100)+1
    const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`

    setformState({...formState,profilePic:randomAvatar})
    toast.success("Avatar changed successfully")
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              {/**IMage Preview */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="profile picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/**Generate random avatar*/}
              <div className="flex items-center gap-2">
                <button onClick={handleRandomAvatar}  type="button" className="btn btn-block">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/* Full Name */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                className="input input-bordered w-full"
                value={formState.fullName}
                onChange={(e) =>
                  setformState({ ...formState, fullName: e.target.value })
                }
                placeholder="Your name"
                autoComplete="off"
              />
            </div>

            {/* Bio */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-semibold">Bio</span>
              </label>
              <textarea
                name="bio"
                className="textarea textarea-bordered w-full min-h-[80px]"
                value={formState.bio}
                onChange={(e) =>
                  setformState({ ...formState, bio: e.target.value })
                }
                placeholder="Tell us about yourself"
              />
            </div>
            {/**Langauge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/**native langauge */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text  mb-1"> Native Langauge</span>
                  </label>
                  <select
                    name="nativeLangauge"
                    value={formState.nativeLangauge}
                    onChange={(e)=>setformState({...formState,nativeLangauge:e.target.value})}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native Langauge</option>
                    {LANGUAGES.map((lang)=>(
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                          {lang}
                      </option>
                    ))}
                  </select>
                </div>
              {/**Learning Langauge */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text  mb-1"> Learning Langauge</span>
                  </label>
                  <select
                    name="nativeLangauge"
                    value={formState.learningLangauge}
                    onChange={(e)=>setformState({...formState,learningLangauge:e.target.value})}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your learning Langauge</option>
                    {LANGUAGES.map((lang)=>(
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                          {lang}
                      </option>
                    ))}
                  </select>
                </div>
            </div>
              {/**location */}
            <div className="formm-control">
              <label className="label">
                  <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70"/>
                <input
                type="text"
                name="location"
                value={formState.location}
                onChange={(e)=>setformState({...formState,location:e.target.value})}
                className="input input-bordered w-full pl-10"
                placeholder="city,Country"
                />
              </div>

            </div>
            {/**submit btn */}
            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                <ShipWheelIcon className="size-5 mr-2"/>
                Complete Onboarding
                </>
              ):(
                <>
                <LoaderIcon className=" animate-spin size-5 mr-2"/>
                Onboarding...

                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
