"use client"

import { ReactNode, isValidElement, cloneElement, ReactElement, Fragment } from "react"
import { toFarsiNumber } from "@/lib/locale"

function transformChildren(children: ReactNode): ReactNode {
  if (typeof children === "string" || typeof children == "number") {
    return toFarsiNumber(children.toString())
  }

  if (Array.isArray(children)) {
    return children.map((child, i) => <Fragment key={i}>{transformChildren(child)}</Fragment>)
  }

  if (isValidElement(children)) {
    const element = children as ReactElement<{ children?: ReactNode }>
    return cloneElement(element, {
      ...element.props,
      children: transformChildren(element.props.children),
    })
  }

  return children
}

export function useFarsiNumbers(children: ReactNode): ReactNode {
  return transformChildren(children)
}
