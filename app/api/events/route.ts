import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: NextRequest){
    try{
        await connectDB();

        const formData = await req.formData();

        // Get the file
        const file = formData.get('image') as File;

        if(!file){
            return NextResponse.json({message: 'Image file is required'},{status: 400})
        }

        const tags = JSON.parse(formData.get('tags') as string);
        const agenda = JSON.parse(formData.get('agenda') as string);

        // Upload to Cloudinary first
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{secure_url: string}>((resolve,reject)=>{
            cloudinary.uploader.upload_stream(
                {resource_type: 'image', folder: 'events'},
                (error, results)=>{
                    if(error) return reject(error);
                    else resolve(results!);
                }
            ).end(buffer);
        });

        if(!uploadResult?.secure_url){
            return NextResponse.json({error: 'Upload failed'},{status:500});
        }

        // Create event object from formData
        const event = Object.fromEntries(formData.entries());
        
        // Replace the File object with the Cloudinary URL
        event.image = uploadResult.secure_url;

        // Now create the event in database
        const createdEvent = await Event.create({
            ...event,
            tags : tags,
            agenda : agenda
        });

        return NextResponse.json({
            message: 'Event created successfully', 
            event: createdEvent
        }, {status: 201});
    }
    catch(e){
        console.error(e);
        return NextResponse.json({
            message: 'Event Creation Failed', 
            error: e instanceof Error ? e.message : 'Unknown'
        }, {status: 400})
    }
}

export async function GET(){

    try{

        await connectDB();

        const events = await Event.find().sort({createdAt: -1});

        return NextResponse.json({message: 'Event listing successful', events},{status: 200});
    }

    catch(e){
        return NextResponse.json({message: 'Event fetching failed',error: e},{status: 500});
    }
}