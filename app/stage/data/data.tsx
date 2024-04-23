import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const labels = [
  {
    value: "erc721",
    label: "ERC721",
  },
]

export const statuses = [
  // {
  //   value: "backlog",
  //   label: "Backlog",
  //   icon: QuestionMarkCircledIcon,
  // },
  {
    value: "resting",
    label: "Resting",
    icon: CircleIcon,
  },
  // {
  //   value: "in progress",
  //   label: "In Progress",
  //   icon: StopwatchIcon,
  // },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  // {
  //   value: "canceled",
  //   label: "Canceled",
  //   icon: CrossCircledIcon,
  // },
]

export const collections = [
  {
    label: "Mate",
    value: "mate",
    icon: ArrowDownIcon,
  },
  {
    label: "Emate",
    value: "emate",
    icon: ArrowRightIcon,
  },
  {
    label: "Bias",
    value: "bias",
    icon: ArrowUpIcon,
  },
]
