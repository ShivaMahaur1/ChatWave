import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
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
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  // ✅ HANDLE IMAGE (BASE64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormState((prev) => ({
        ...prev,
        profilePic: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-3xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Complete Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="size-32 rounded-full overflow-hidden bg-gray-200">
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

            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={formState.fullName}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                fullName: e.target.value,
              }))
            }
            className="input input-bordered w-full"
          />

          {/* Bio */}
          <textarea
            placeholder="Bio"
            value={formState.bio}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                bio: e.target.value,
              }))
            }
            className="textarea textarea-bordered w-full"
          />

          {/* Languages */}
          <div className="grid grid-cols-2 gap-4">
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
              <option value="">Native Language</option>
              {LANGUAGES.map((lang) => (
                <option key={lang}>{lang}</option>
              ))}
            </select>

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
              <option value="">Learning Language</option>
              {LANGUAGES.map((lang) => (
                <option key={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-3 size-5 opacity-70" />
            <input
              type="text"
              placeholder="Location"
              value={formState.location}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="input input-bordered w-full pl-10"
            />
          </div>

          {/* Submit */}
          <button className="btn btn-primary w-full" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderIcon className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <ShipWheelIcon className="mr-2" />
                Complete Onboarding
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
