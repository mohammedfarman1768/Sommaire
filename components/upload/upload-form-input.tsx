'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';
import { forwardRef, FormEventHandler } from 'react';

interface UploadFormInputProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
}

// Forward the ref to the <form> element
const UploadFormInput = forwardRef<HTMLFormElement, UploadFormInputProps>(
  ({ onSubmit, isLoading }, ref) => {
    return (
      <form ref={ref} className="flex flex-col gap-6" onSubmit={onSubmit}>
        <div className="flex items-center justify-end gap-1.5">
          <Input
            type="file"
            id="file"
            name="file"
            accept="application/pdf"
            required
            className={cn(isLoading && 'cursor-not-allowed opacity-50')}
            disabled={isLoading}
          />
          <Button
            disabled={isLoading}
            className="bg-rose-600 hover:cursor-pointer hover:bg-rose-700"
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Upload Your PDF'
            )}
          </Button>
        </div>
      </form>
    );
  }
);

UploadFormInput.displayName = 'UploadFormInput';

export default UploadFormInput;
