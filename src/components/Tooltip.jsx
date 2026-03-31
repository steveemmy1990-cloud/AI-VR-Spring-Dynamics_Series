import React from 'react'
import { useTooltip } from '../context/TooltipContext'
import './Tooltip.css'

const Tooltip = () => {
  const { tooltip } = useTooltip()

  if (!tooltip.show) return null

  return (
    <div
      className="item-tooltip"
      style={{
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`
      }}
    >
      {tooltip.text}
    </div>
  )
}

export default Tooltip
