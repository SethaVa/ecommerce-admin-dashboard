"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from 'lucide-react';
import Image from "next/image";
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps{
    disabled: boolean,
    value: string[],
    onChange: (value: string) => void,
    onRemove: (value: string) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    value,
    onChange,
    onRemove
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted){
        return null;
    }

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
      };

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {
                    value.map((url) => (
                        <div key={url} className="relative h-[200px] w-[200px] rounded-md overflow-hidden">
                            <div className="z-10 absolute top-2 right-2">
                                <Button variant="destructive" size="sm" type="button" onClick={() => onRemove(url)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                            <Image 
                                fill
                                className="object-cover"
                                alt="Image"
                                src={url}
                            />
                        </div>
                    ))
                }
            </div>
            <CldUploadWidget uploadPreset="next-ecommerce" onUpload={onUpload}>
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <Button 
                        type="button" 
                        disabled={disabled} 
                        variant="secondary" 
                        onClick={onClick}
                        >
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Upload an Image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;