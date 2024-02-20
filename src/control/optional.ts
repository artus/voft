export class Optional<Embedded> {
  private constructor(private readonly value?: Embedded) {
    // Do nothing.
  }

  isPresent(): boolean {
    return !!this.value;
  }

  isEmpty(): boolean {
    return !this.value;
  }

  map<NextEmbedded>(
    executor: (embedded: Embedded) => NextEmbedded
  ): Optional<NextEmbedded> {
    if (this.isPresent()) {
      return Optional.of(executor(this.value!));
    } else {
      return Optional.empty<NextEmbedded>();
    }
  }

  get(): Embedded {
    if (this.isPresent()) {
      return this.value!;
    } else {
      throw new Error('Cannot get value of an empty Optional');
    }
  }

  getOrElse<NextEmbedded>(
    executor: () => NextEmbedded
  ): Embedded | NextEmbedded {
    if (this.isPresent()) {
      return this.value!;
    } else {
      return executor();
    }
  }

  getOrElseThrow(
    failureMapper = (error: Error): never => {
      throw error;
    }
  ): Embedded {
    if (this.isPresent()) {
      return this.value!;
    } else {
      throw failureMapper(new Error('Cannot get value of an empty Optional'));
    }
  }

  filter(
    predicate: (embedded: Embedded) => Optional<Embedded>
  ): Optional<Embedded> {
    if (this.isPresent() && predicate(this.value!)) {
      return this;
    } else {
      return Optional.empty<Embedded>();
    }
  }

  ifPresent(consumer: (embedded: Embedded) => void): Optional<Embedded> {
    if (this.isPresent()) {
      consumer(this.value!);
    }
    return this;
  }

  static empty<Embedded>(): Optional<Embedded> {
    return new Optional<Embedded>();
  }

  static of<Embedded>(value: Embedded): Optional<Embedded> {
    return new Optional(value);
  }
}
