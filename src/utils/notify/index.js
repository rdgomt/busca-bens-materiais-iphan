import { toast } from 'react-toastify'

export function notifyDefault(msg) {
  toast(`${msg}`, {
    position: toast.POSITION.TOP_RIGHT,
  })
}

export function notifySuccess(msg) {
  toast.success(`${msg}`, {
    position: toast.POSITION.TOP_RIGHT,
  })
}

export function notifyError(msg) {
  toast.error(`${msg}`, {
    position: toast.POSITION.TOP_RIGHT,
  })
}

export function notifyInfo(msg) {
  toast.info(`${msg}`, {
    position: toast.POSITION.TOP_RIGHT,
  })
}

export function notifyWarning(msg) {
  toast.warn(`${msg}`, {
    position: toast.POSITION.TOP_RIGHT,
  })
}
