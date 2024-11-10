import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';
import { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';

const baseurl = 'https://techihubjobsproject.azurewebsites.net';

interface EditProfileDialogProps {
  userProfile: {
    first_name: string;
    last_name: string;
    address: string;
    email: string;
    role_name: string;
    phone_number: string;
    githubUrl: string;
    linkedinUrl: string;
    about: string;
  };
  trigger?: React.ReactNode;
}

// Submit button component with loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        'Save Changes'
      )}
    </Button>
  );
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ userProfile, trigger }) => {
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const formAction = async (prevState: any, formData: FormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Updating profile...");
    
    try {
      // @ts-ignore
      const userId = session?.user?.userId;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const profile = {
        first_name: formData.get('firstname'),
        last_name: formData.get('lastname'),
        address: formData.get('address'),
        email: formData.get('email'),
        role_name: formData.get('jobTitle'),
        phone_number: formData.get('phoneNumber'),
        githubUrl: formData.get('githubUrl'),
        linkedinUrl: formData.get('linkedinUrl'),
        about: formData.get('about'),
        username: `${formData.get('firstname')} ${formData.get('lastname')}`
      };

      const response = await fetch(`${baseurl}/api/user-profile/update-name-role/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();

      // Update SWR cache
      await mutate(`/api/user-profile/${userId}`);
      
      setOpen(false);
      toast.update(toastId, {
        render: "Profile updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      return { message: "Profile updated successfully" };
    } catch (error) {
      toast.update(toastId, {
        render: error instanceof Error ? error.message : "Failed to update profile",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return { message: "Error: Failed to update profile" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const [formState, formAction2] = useFormState(formAction, { message: '' });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || <Button variant="outline">Edit Profile</Button>}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <form action={formAction2} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  defaultValue={userProfile.first_name}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  defaultValue={userProfile.last_name}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={userProfile.email}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                defaultValue={userProfile.phone_number}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={userProfile.address}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                defaultValue={userProfile.role_name}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  defaultValue={userProfile.githubUrl}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  defaultValue={userProfile.linkedinUrl}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                name="about"
                defaultValue={userProfile.about}
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <SubmitButton />
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default EditProfileDialog;