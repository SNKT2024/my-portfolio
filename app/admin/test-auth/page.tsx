// src/app/admin/test-auth/page.tsx
import { createProject } from "@/actions/projectActions";

export default function TestAuthPage() {
  async function triggerTestMutation() {
    "use server";
    await createProject({
      title: "Auth Security Test",
      category: "Test",
      type: "Test",
      description: "Testing server action security",
      points: ["Point 1"],
      techStack: ["Next.js"],
    });
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Security Verification</h1>
      <form action={triggerTestMutation}>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded font-medium"
        >
          Execute Protected Mutation
        </button>
      </form>
    </div>
  );
}
