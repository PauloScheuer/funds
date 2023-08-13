export default class ExtraLabel {
  constructor(
    public prop: string,
    public label: (prop: any) => string
  ) {}
}
