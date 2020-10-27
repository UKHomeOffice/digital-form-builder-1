import { getExpression } from "./inline-condition-operators";
import {
  ConditionValue,
  AbstractConditionValue,
  RelativeTimeValue,
} from "./inline-condition-values";
import { Coordinator } from "./helpers";
import { Field } from "./field";

export class AbstractCondition {
  coordinator: Coordinator | undefined;

  constructor(coordinator: Coordinator | undefined) {
    if (coordinator && !Object.values(Coordinator).includes(coordinator)) {
      throw Error(`coordinator ${coordinator} is not a valid coordinator`);
    }

    this.coordinator = coordinator;
  }

  coordinatorString() {
    return this.coordinator ? `${this.coordinator} ` : "";
  }

  getCoordinator() {
    return this.coordinator;
  }

  setCoordinator(coordinator: Coordinator | undefined) {
    this.coordinator = coordinator;
  }

  isGroup() {
    return false;
  }

  getGroupedConditions() {
    return [this];
  }

  _asFirstCondition() {
    delete this.coordinator;
  }

  asFirstCondition() {
    throw Error(
      "Unsupported Operation. Method asFirstCondition have not been implemented"
    );
  }

  clone() {
    throw Error(
      "Unsupported Operation. Method clone have not been implemented"
    );
  }

  conditionString() {
    throw Error(
      "Unsupported Operation. Method conditionString have not been implemented"
    );
  }

  conditionExpression() {
    throw Error(
      "Unsupported Operation. Method conditionExpression have not been implemented"
    );
  }
}

export class Condition extends AbstractCondition {
  field: Field;
  operator: string;
  value: ConditionValue | RelativeTimeValue;

  constructor(
    field: Field,
    operator: string,
    value: ConditionValue | RelativeTimeValue,
    coordinator?: Coordinator
  ) {
    super(coordinator);

    if (!(field instanceof Field)) {
      throw Error(`field ${field} is not a valid Field object`);
    }
    if (typeof operator !== "string") {
      throw Error(`operator ${operator} is not a valid operator`);
    }
    if (!(value instanceof AbstractConditionValue)) {
      throw Error(`value ${value} is not a valid value type`);
    }

    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  asFirstCondition() {
    this._asFirstCondition();
    return this;
  }

  conditionString() {
    return `'${this.field.display}' ${
      this.operator
    } '${this.value.toPresentationString()}'`;
  }

  conditionExpression() {
    return getExpression(
      this.field.type,
      this.field.name,
      this.operator,
      this.value
    );
  }

  clone() {
    return new Condition(
      Field.from(this.field),
      this.operator,
      this.value.clone(),
      this.coordinator
    );
  }
}
