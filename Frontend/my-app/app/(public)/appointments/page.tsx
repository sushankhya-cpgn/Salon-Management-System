"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AppointmentInput, appointmentSchema } from "@/lib/validations/schemas/appointmentSchema";

import useService from "@/hooks/use-service";
import { createAppointment } from "@/lib/api/appointment";


export default function AppointmentForm() {

    const today = new Date();
    const defaultDate = today.toISOString().split("T")[0];
    const defaultTime = today.toTimeString().slice(0, 5);
    const { services, loading, error } = useService();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<AppointmentInput>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            customerName: "",
            email: "",
            date: defaultDate,
            startTime: defaultTime,
            serviceId: undefined,
        },
    });

    const onSubmit = async(data: any) => {

        try{

            console.log(`Data submitted ${JSON.stringify(data)}`);
            const res = await createAppointment(data)
            
        }
        
        catch(error){
             console.log(error);

        }
        
    }

    return (
        <div className=" mt-4">
            <Card className=" w-full">
                <CardHeader>
                    <CardTitle>Book Appointment</CardTitle>
                    <p>{errors.date?.message}</p>
                    <p>{errors.startTime?.message}</p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Customer Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Customer Information</h3>

                            <div className="space-y-2">
                                <Label>Customer Name</Label>
                                <Input
                                    placeholder="John Doe"
                                    {...register('customerName')}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    {...register('email')}

                                />
                            </div>
                        </div>

                        {/* Service Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Service Information</h3>

                            <div className="space-y-2">
                                <Label>Service</Label>
                                <Controller
                                    name="serviceId"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Select
                                                value={field.value?.toString() || ""}
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                disabled={loading || !!error}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select service" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {services.map((service:any) => (
                                                        <SelectItem key={service.id} value={String(service.id)}>
                                                            {service.name} - ${service.price} ({service.duration} min)
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-red-500 text-sm">{errors.serviceId?.message}</p>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    {...register("date")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Input
                                    type="time"
                                    {...register("startTime")}
                                />
                            </div>
                        </div>
                        <div className=" w-full flex items-center justify-center">
                            <Button disabled={isSubmitting} className="w-xl mx-auto">Book Appointment</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
