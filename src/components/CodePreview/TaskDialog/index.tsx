'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import useGeneral from '@/hooks/useGeneral'
import useTask from '@/hooks/useTask'
import useTransformation from '@/hooks/useTransformation'
import { TaskData, taskSchema } from '@/schemas/task-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

export default function TaskDialog() {
  const { openTaskDialog, setOpenTaskDialog } = useTask()
  const { appData, getVariableNames } = useGeneral()
  const { getNumberOfOutputAttributes } = useTransformation()

  const form = useForm<TaskData>({
    mode: 'onSubmit',
    resolver: zodResolver(taskSchema),
    defaultValues: {
      transformationId: 1,
      outputElement: [],
      inputElement: [],
    },
  })

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'outputElement',
  })

  const onSubmit = (data: TaskData) => {
    console.log(data)
  }

  const selectedTransformationId = form.watch('transformationId')

  useEffect(() => {
    const defaultFields = Array.from(
      { length: getNumberOfOutputAttributes(Number(selectedTransformationId)) },
      () => ({ variableName: getVariableNames()[0].variableName }),
    )
    replace(defaultFields)
  }, [
    selectedTransformationId,
    replace,
    getNumberOfOutputAttributes,
    getVariableNames,
  ])

  return (
    <Dialog
      open={openTaskDialog}
      onClose={() => setOpenTaskDialog(false)}
      fullWidth={true}
      maxWidth={'sm'}
      className="z-10"
    >
      <DialogTitle>Create new task</DialogTitle>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center justify-center gap-3 p-5"
          >
            <FormField
              control={form.control}
              name="transformationId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Select the transformation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select the transformation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appData.transformations.map((transformation) => (
                        <SelectItem
                          key={transformation.id}
                          value={String(transformation.id)}
                        >
                          {transformation.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormLabel className="self-start">Select output element</FormLabel>
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`outputElement.${index}.variableName`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={getVariableNames()[0].variableName}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select the input elements" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getVariableNames().map((variable, index) => (
                          <SelectItem key={index} value={variable.variableName}>
                            {variable.variableName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="w-1/2">
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
