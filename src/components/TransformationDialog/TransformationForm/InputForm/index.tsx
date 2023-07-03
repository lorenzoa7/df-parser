import useAttribute from '@/hooks/useAttribute'
import useGeneral from '@/hooks/useGeneral'
import useInput from '@/hooks/useInput'
import useTransformation from '@/hooks/useTransformation'
import {
  Attribute,
  InputChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from '@/utils/types'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { BsFillPencilFill } from 'react-icons/bs'
import InputAttribute from './InputAttribute'
import * as C from './styles'

type FormDataProps = {
  name: string
}

export default function InputForm() {
  const [openAttributeDialog, setOpenAttributeDialog] = useState(false)
  const { selectedInput, updateInput } = useInput()
  const { setSelectedAttribute, createInputAttribute, deleteInputAttribute } =
    useAttribute()
  const { selectedTransformation } = useTransformation()
  const { appData } = useGeneral()
  const [formData, setFormData] = useState<FormDataProps>({
    name: selectedInput?.name!,
  })
  const [outputReference, setOutputReference] = useState(
    selectedInput?.transformationOutputReferenceId
      ? selectedInput?.transformationOutputReferenceId
      : selectedTransformation!.id,
  )

  const handleChange = (e: InputChangeEvent) =>
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

  const handleBlur = () => {
    updateInput(selectedTransformation?.id!, selectedInput?.id!, formData)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement
      target.blur()
    }
  }

  const handleCreateAttribute = () => {
    createInputAttribute(selectedTransformation!.id, selectedInput!)
  }

  const handleDeleteAttribute = (e: MouseEvent, attributeId: number) => {
    e.stopPropagation()

    deleteInputAttribute(
      selectedTransformation!.id,
      selectedInput!,
      attributeId,
    )
  }

  const handleEditAttribute = (attribute: Attribute) => {
    setSelectedAttribute(attribute)
    setOpenAttributeDialog(true)
  }

  const handleSetOutputReference = (transformationId: number) => {
    setOutputReference(transformationId)
    const newReference =
      transformationId === selectedTransformation!.id ? null : transformationId

    updateInput(selectedTransformation?.id!, selectedInput?.id!, {
      transformationOutputReferenceId: newReference,
    })
  }

  return (
    <C.Container>
      <C.Form>
        {/* Forms */}

        <C.InputGroup>
          <C.Label>Name</C.Label>
          <C.Input
            name="name"
            value={formData.name}
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </C.InputGroup>

        <C.InputGroup>
          <C.Label>Attributes</C.Label>
          <C.InputAttributeList>
            <C.AddButtonContainer>
              <C.AddAttributeButton
                type="button"
                onClick={handleCreateAttribute}
              >
                +
              </C.AddAttributeButton>
            </C.AddButtonContainer>
            {selectedInput?.attributes.length === 0 ? (
              <C.EmptyLabel>Create new attributes</C.EmptyLabel>
            ) : (
              selectedInput?.attributes.map((attribute) => (
                <C.InputAttribute
                  key={attribute.id}
                  onClick={() => handleEditAttribute(attribute)}
                >
                  <BsFillPencilFill size={20} />
                  <span className="w-full text-start">{attribute.name}</span>
                  <C.DeleteAttribute
                    onClick={(e) => handleDeleteAttribute(e, attribute.id)}
                  >
                    <AiFillDelete size={'75%'} />
                  </C.DeleteAttribute>
                </C.InputAttribute>
              ))
            )}
          </C.InputAttributeList>
        </C.InputGroup>

        {/* Dialogs */}
        <Dialog
          open={openAttributeDialog}
          onClose={() => setOpenAttributeDialog(false)}
          fullWidth={true}
          maxWidth={'xs'}
        >
          <DialogTitle>Set new input attribute</DialogTitle>
          <DialogContent>
            <InputAttribute />
          </DialogContent>
        </Dialog>
      </C.Form>

      <C.TransformationListContainer>
        <span className="text-center font-medium">
          Set input as another transformation output
        </span>
        {selectedTransformation && (
          <C.TransformationItem
            key={selectedTransformation.id}
            onClick={() => handleSetOutputReference(selectedTransformation.id)}
            $selected={outputReference === selectedTransformation.id}
          >
            <span className="w-full text-start">No output reference</span>
          </C.TransformationItem>
        )}
        {appData.transformations.map((transformation) =>
          transformation.id === selectedTransformation?.id ? null : (
            <C.TransformationItem
              key={transformation.id}
              onClick={() => handleSetOutputReference(transformation.id)}
              $selected={outputReference === transformation.id}
            >
              <span className="w-full text-start">{transformation.name}</span>
            </C.TransformationItem>
          ),
        )}
      </C.TransformationListContainer>
    </C.Container>
  )
}
