/**
 * An Optional is a container that may or may not contain a value.
 *
 * @example
 * // Returns 6
 * const value = Optional.of(5);
 * const result = value.map(value => value + 1).getOrElse(() => 5);
 *
 * // Returns 5
 * const empty = Optional.empty();
 * const emptyResult = empty.map(value => value + 1).getOrElse(() => 5);
 */
export class Optional<Embedded> {
  private constructor(private readonly value?: Embedded) {
    // Do nothing.
  }

  /**
   * Check if the Optional contains a value. If the value supplied to the optional is null or undefined, this will return false.
   *
   * @returns true if the Optional contains a value, false otherwise.
   */
  isPresent(): boolean {
    return !!this.value;
  }

  /**
   * Check if the Optional does not contain a value. If the value supplied to the optional is null or undefined, this will return true.
   *
   * @returns true if the Optional does not contain a value, false otherwise.
   */
  isEmpty(): boolean {
    return !this.value;
  }

  /**
   * Map the Optional to a new Optional, with the value transformed by the executor. If the Optional is empty, this will return an empty Optional.
   *
   * @param executor A function that takes the Optional's value and returns a new value.
   * @returns A new Optional with the mapped value, or an empty Optional if this Optional is empty.
   */
  map<NextEmbedded>(
    executor: (embedded: Embedded) => NextEmbedded
  ): Optional<NextEmbedded> {
    if (this.isPresent()) {
      return Optional.of(executor(this.value!));
    } else {
      return Optional.empty<NextEmbedded>();
    }
  }

  /**
   * Get the value of the Optional. If the Optional is empty, this will throw an error.
   *
   * @returns The value of the Optional.
   */
  get(): Embedded {
    if (this.isPresent()) {
      return this.value!;
    } else {
      throw new Error('Cannot get value of an empty Optional');
    }
  }

  /**
   * Get the value of the Optional, or the result of the executor if the Optional is empty.
   *
   * @param executor A function that returns a value if the Optional is empty.
   * @returns The value of the Optional, or the result of the executor if the Optional is empty.
   */
  getOrElse<NextEmbedded>(
    executor: () => NextEmbedded
  ): Embedded | NextEmbedded {
    if (this.isPresent()) {
      return this.value!;
    } else {
      return executor();
    }
  }

  /**
   * Get the value of the Optional, or throw an error if the Optional is empty.
   *
   * @param failureMapper A function that takes an error and returns an error.
   * @returns The value of the Optional.
   */
  getOrElseThrow(
    failureMapper = (error: Error): Error => {
      return error;
    }
  ): Embedded {
    if (this.isPresent()) {
      return this.value!;
    } else {
      throw failureMapper(new Error('Cannot get value of an empty Optional'));
    }
  }

  /**
   * Filter the Optional. If the Optional is empty or the predicate returns false, this will return an empty Optional.
   *
   * @param predicate A function that takes the Optional's value and returns a boolean.
   * @returns The Optional if the predicate returns true, an empty Optional otherwise.
   */
  filter(predicate: (embedded: Embedded) => boolean): Optional<Embedded> {
    if (this.isPresent() && predicate(this.value!)) {
      return this;
    } else {
      return Optional.empty<Embedded>();
    }
  }

  /**
   * Execute the consumer with the value of the Optional if the Optional is present. If the Optional is empty, this will do nothing.
   *
   * @param consumer A function that takes the Optional's value.
   * @returns The Optional.
   */
  ifPresent(consumer: (embedded: Embedded) => void): Optional<Embedded> {
    if (this.isPresent()) {
      consumer(this.value!);
    }
    return this;
  }

  /**
   * Create an empty Optional.
   *
   * @returns An empty Optional.
   */
  static empty<Embedded>(): Optional<Embedded> {
    return new Optional<Embedded>();
  }

  /**
   * Create an Optional with a value.
   *
   * @param value The value to embed in the Optional.
   * @returns An Optional with the value.
   */
  static of<Embedded>(value: Embedded): Optional<Embedded> {
    return new Optional(value);
  }
}
