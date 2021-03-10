
type Options = {
  name?: string
  type?: string
}

type OptionsWidthHeight = {
  width: number
  height: number
} & Options

type OptionsScale = {
  scale: number
} & Options

export default skaler = (file: File, options: OptionsWidthHeight | OptionsScale) => Promise<File>
