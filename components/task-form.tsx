"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { v4 as uuidv4 } from "uuid"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useTaskContext } from "./providers"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

const formSchema = z.object({
  date: z.date(),
  time: z.string(),
  title: z.string().min(1, "Başlık gerekli"),
  description: z.string().optional(),
  type: z.enum(["Okul Dersi", "Yazılım", "TYT", "İngilizce"] as const),
  isRecurring: z.boolean(),
  recurringDays: z.array(z.string()).optional(),
  hasNotification: z.boolean(),
  email: z.string().email().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface TaskFormProps {
  onSuccess: () => void
}

export function TaskForm({ onSuccess }: TaskFormProps) {
  const { dispatch } = useTaskContext()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      time: "09:00",
      title: "",
      description: "",
      type: "Okul Dersi",
      isRecurring: false,
      recurringDays: [],
      hasNotification: false,
      email: "",
    },
  })

  const isRecurring = form.watch("isRecurring")
  const hasNotification = form.watch("hasNotification")

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true)

      const task = {
        id: uuidv4(),
        date: format(values.date, "dd.MM"),
        time: values.time,
        title: values.title,
        description: values.description || "",
        type: values.type,
        status: "pending" as const,
        isRecurring: values.isRecurring,
        recurringDays: values.recurringDays?.map(Number) || [],
        hasNotification: values.hasNotification,
        email: values.hasNotification ? values.email : undefined,
      }

      dispatch({ type: "ADD_TASK", task })

      toast({
        title: "Başarılı",
        description: "Görev başarıyla eklendi.",
      })

      form.reset()
      onSuccess()
    } catch (error) {
      toast({
        title: "Hata",
        description: "Görev eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tarih</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Tarih seçin</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saat</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Başlık</FormLabel>
              <FormControl>
                <Input placeholder="Görev başlığı" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Textarea placeholder="Görev açıklaması" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tür</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Görev türü seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Okul Dersi">Okul Dersi</SelectItem>
                  <SelectItem value="Yazılım">Yazılım</SelectItem>
                  <SelectItem value="TYT">TYT</SelectItem>
                  <SelectItem value="İngilizce">İngilizce</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Tekrarlanan Görev</FormLabel>
                <FormDescription>Bu görev belirli günlerde tekrarlanacak</FormDescription>
              </div>
            </FormItem>
          )}
        />

        {isRecurring && (
          <FormField
            control={form.control}
            name="recurringDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tekrar Günleri</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Örn: 1,15,30"
                    value={field.value?.join(",")}
                    onChange={(e) => field.onChange(e.target.value.split(","))}
                  />
                </FormControl>
                <FormDescription>Görevin tekrarlanacağı günleri virgülle ayırarak girin</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="hasNotification"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Email Bildirimi</FormLabel>
                <FormDescription>Görev zamanı geldiğinde email bildirimi al</FormDescription>
              </div>
            </FormItem>
          )}
        />

        {hasNotification && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Adresi</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="ornek@mail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Ekleniyor..." : "Görevi Ekle"}
        </Button>
      </form>
    </Form>
  )
}

