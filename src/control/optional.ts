export class Optional<Embedded> {

  private constructor(
    private readonly value?: Embedded
  ) {
    // Do nothing.
  }

  isPresent() {
    return !!this.value;
  }

  isEmpty() {
    return !this.value;
  }

  map<NextEmbedded>(executor: (embedded: Embedded) => NextEmbedded) {
    if (this.isPresent()) {
      return Optional.of(executor(this.value!));
    } else {
      return Optional.empty();
    }
  }

  get() {
    if (this.isPresent()) {
      return this.value!;
    } else {
      throw new Error('Cannot get value of an empty Optional');
    }
  }

  getOrElse<NextEmbedded>(executor: () => NextEmbedded) {
    if (this.isPresent()) {
      return this.value!;
    } else {
      return executor();
    }
  }

  getOrElseThrow(failureMapper = (error: Error) => { throw error }) {
    if (this.isPresent()) {
      return this.value!;
    } else {
      throw failureMapper(new Error('Cannot get value of an empty Optional'));
    }
  }

  filter(predicate: (embedded: Embedded) => Optional<Embedded>) {
    if (this.isPresent() && predicate(this.value!)) {
      return this;
    } else {
      return Optional.empty();
    }
  }

  ifPresent(consumer: (embedded: Embedded) => void) {
    if (this.isPresent()) {
      consumer(this.value!);
    }
    return this;
  }

  static empty() {
    return new Optional();
  }

  static of<Embedded>(value: Embedded) {
    return new Optional(value);
  }
}