import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();

  const [formState, setFormState] = useState({
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
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitting:", formState); // DEBUG

    onboardingMutation(formState);
  };

  // ✅ FIXED AVATAR FUNCTION
  const handleRandomAvatar = () => {
    const randomAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`;

    setFormState((prev) => ({
      ...prev,
      profilePic: randomAvatar,
    }));

    toast.success("Avatar changed successfully");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 opacity-40" />
                  </div>
                )}
              </div>

              <button
                onClick={handleRandomAvatar}
                type="button"
                className="btn btn-block"
              >
                <ShuffleIcon className="size-4 mr-2" />
                Generate Random Avatar
              </button>
            </div>

            {/* Full Name */}
            <div className="form-control">
              <label className="label font-semibold">Full Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
              />
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label font-semibold">Bio</label>
              <textarea
                className="textarea textarea-bordered"
                value={formState.bio}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
              />
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Native */}
              <div className="form-control">
                <label className="label">Native Language</label>
                <select
                  value={formState.nativeLangauge}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      nativeLangauge: e.target.value,
                    }))
                  }
                  className="select select-bordered"
                >
                  <option value="">Select</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning */}
              <div className="form-control">
                <label className="label">Learning Language</label>
                <select
                  value={formState.learningLangauge}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      learningLangauge: e.target.value,
                    }))
                  }
                  className="select select-bordered"
                >
                  <option value="">Select</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">Location</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 size-5 opacity-70" />
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Submit */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              ) : (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
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
