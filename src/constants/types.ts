export type AdditionalFeatures = {
  [id: number]: AdditionalFeature
}

export interface AdditionalFeature {
    title: string
    price: number
}

export interface FormOrderInterface {
    firstName: string
    lastName: string
    email: string
    comment?: string
    productType: ProductType
    additionalFeatures: Array<AdditionalFeature>
    totalPrice: number
}

export interface ValidationParamsInterface<U> {
    formFieldValid: {
        [key: string]: boolean
    }
    emailCheck: boolean,
    emptyField: Array<keyof U>,
    formValid: undefined | boolean,
    readyToSend: boolean
}

export interface ProductType {
    title: string
    price: number
}

export interface Item {
    title: string
}

export type ItemsAccordion<U> = Array<U extends Item ? U : never>;

export interface AccordionProps<U> {
    items: ItemsAccordion<U>
    className?: string
    handleChange?: (item: U) => any
}