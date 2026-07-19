import React from "react";
import { act, create } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import useLogin from "../src/hooks/useLogin";

vi.mock("../src/lib/allauth", async (importOriginal) => ({
  ...(await importOriginal()),
  login: vi.fn(),
}));

import { login } from "../src/lib/allauth";

let hook;
let currentLocation;

function HookHarness() {
  hook = useLogin();
  currentLocation = useLocation().pathname;
  return null;
}

async function renderHook() {
  let renderer;
  await act(async () => {
    renderer = create(
      <MemoryRouter initialEntries={["/account/login"]}>
        <Routes>
          <Route path="*" element={<HookHarness />} />
        </Routes>
      </MemoryRouter>,
    );
  });
  return renderer;
}

async function submit() {
  await act(async () => {
    hook.handleSubmit();
  });
}

describe("useLogin failure surfacing", () => {
  beforeEach(() => {
    hook = undefined;
    currentLocation = undefined;
    vi.mocked(login).mockReset();
  });

  it("passes through field errors from a 400 response", async () => {
    const errors = [{ param: "password", message: "Incorrect password." }];
    vi.mocked(login).mockResolvedValue({ status: 400, errors });
    const renderer = await renderHook();

    await submit();

    expect(hook.errors).toEqual(errors);
    renderer.unmount();
  });

  it("synthesizes an error for a 401 with no pending flow", async () => {
    vi.mocked(login).mockResolvedValue({
      status: 401,
      meta: { is_authenticated: false },
      data: { flows: [] },
    });
    const renderer = await renderHook();

    await submit();

    expect(hook.errors).toHaveLength(1);
    expect(hook.errors[0].message).toMatch(/sign-in failed/i);
    expect(currentLocation).toBe("/account/login");
    renderer.unmount();
  });

  it("synthesizes an error for a failure body without errors or flows", async () => {
    vi.mocked(login).mockResolvedValue({ status: 500 });
    const renderer = await renderHook();

    await submit();

    expect(hook.errors).toHaveLength(1);
    expect(hook.errors[0].message).toMatch(/status 500/);
    renderer.unmount();
  });

  it("surfaces a rate-limit message for a 429", async () => {
    vi.mocked(login).mockResolvedValue({ status: 429 });
    const renderer = await renderHook();

    await submit();

    expect(hook.errors).toHaveLength(1);
    expect(hook.errors[0].message).toMatch(/too many sign-in attempts/i);
    renderer.unmount();
  });

  it("navigates to a pending flow on a 401 instead of staying silent", async () => {
    vi.mocked(login).mockResolvedValue({
      status: 401,
      meta: { is_authenticated: false },
      data: { flows: [{ id: "verify_email", is_pending: true }] },
    });
    const renderer = await renderHook();

    await submit();

    expect(currentLocation).toBe("/account/verify-email");
    renderer.unmount();
  });

  it("surfaces a connectivity error when the request rejects", async () => {
    vi.mocked(login).mockRejectedValue(new Error("network down"));
    const renderer = await renderHook();

    await submit();

    expect(hook.errors).toHaveLength(1);
    expect(hook.errors[0].message).toMatch(/unable to reach/i);
    expect(hook.isLoading).toBe(false);
    renderer.unmount();
  });
});
