import type { BaseIssue, BaseSchema, InferOutput } from "valibot";
import * as v from "valibot";
import { AppError } from "../middleware/errors";

type ValidationMessage = {
  code: string;
  message: string;
};

const validationMessages: Record<string, string> = {
  DATE_REQUIRED: "Date is required",
  INVALID_CATEGORY_ID: "Valid categoryId is required",
  INVALID_DATE: "Invalid date",
  INVALID_HABIT_ID: "Valid habit id is required",
  INVALID_TIMEZONE: "Invalid timezone",
  TIMEZONE_REQUIRED: "Timezone is required",
  TITLE_REQUIRED: "Title is required",
  TITLE_TOO_LONG: "Title must be 80 characters or fewer",
};

const requiredCodesByPathKey: Record<string, string> = {
  categoryId: "INVALID_CATEGORY_ID",
  date: "DATE_REQUIRED",
  timezone: "TIMEZONE_REQUIRED",
  title: "TITLE_REQUIRED",
};

export function parseRequest<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  schema: TSchema,
  input: unknown
): InferOutput<TSchema> {
  const result = v.safeParse(schema, input);

  if (result.success) {
    return result.output;
  }

  const validationMessage = getValidationMessage(result.issues[0]);

  throw new AppError(
    400,
    validationMessage.code,
    validationMessage.message
  );
}

function getValidationMessage(issue: BaseIssue<unknown>): ValidationMessage {
  const missingFieldCode = getMissingFieldCode(issue);

  if (missingFieldCode) {
    return {
      code: missingFieldCode,
      message: validationMessages[missingFieldCode],
    };
  }

  const issueMessage = issue.message;

  if (
    typeof issueMessage === "string" &&
    issueMessage in validationMessages
  ) {
    return {
      code: issueMessage,
      message: validationMessages[issueMessage],
    };
  }

  return {
    code: "VALIDATION_ERROR",
    message: "Invalid request",
  };
}

function getMissingFieldCode(issue: BaseIssue<unknown>) {
  const pathKey = issue.path?.at(-1)?.key;

  if (
    typeof pathKey === "string" &&
    pathKey in requiredCodesByPathKey &&
    issue.input === undefined
  ) {
    return requiredCodesByPathKey[pathKey];
  }

  return null;
}
