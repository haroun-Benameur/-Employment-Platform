import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const ResetPassword = () => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-12 flex justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Reset password</CardTitle>
              <CardDescription>Paste the token you received and set a new password.</CardDescription>
            </CardHeader>
            <CardContent>
              {done ? (
                <div className="text-sm">Your password has been reset. You can now log in.</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}
                  <div className="space-y-2">
                    <label htmlFor="token" className="text-sm font-medium">Token</label>
                    <Input id="token" type="text" value={token} onChange={(e) => setToken(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">New password</label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm" className="text-sm font-medium">Confirm password</label>
                    <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
