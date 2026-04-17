'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import api from '@/lib/api'

const schema = z.object({
  church_name: z.string().min(3, 'Nome da igreja obrigatório'),
  name:        z.string().min(2, 'Nome obrigatório'),
  email:       z.string().email('E-mail inválido'),
  password:    z.string().min(8, 'Mínimo 8 caracteres'),
  confirm:     z.string(),
}).refine(d => d.password === d.confirm, { message: 'Senhas não coincidem', path: ['confirm'] })

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep]       = useState<1 | 2>(1)

  const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const nextStep = async () => {
    const ok = await trigger(['church_name', 'name'])
    if (ok) setStep(2)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { name: data.name, church_name: data.church_name } },
      })
      if (error) throw error
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        church_name: data.church_name,
      })
      toast.success('Conta criada! Verifique seu e-mail.')
      router.push('/auth/login')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-accent mb-4 shadow-lg">
            <span className="text-2xl">⛪</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[#020617] tracking-tight">Criar conta</h1>
          <p className="text-sm text-muted mt-1">Configure sua plataforma em minutos</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-secondary text-white' : 'bg-[#E2E8F0] text-muted'}`}>{s}</div>
              {s < 2 && <div className={`w-12 h-0.5 transition-all ${step > s ? 'bg-secondary' : 'bg-[#E2E8F0]'}`} />}
            </div>
          ))}
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-base font-bold mb-4">Sobre a sua Igreja</h2>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">Nome da Igreja *</label>
                  <input {...register('church_name')} className="input" placeholder="Igreja Comunidade da Graça" />
                  {errors.church_name && <p className="text-xs text-danger mt-1">{errors.church_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">Seu Nome (Pastor/Admin) *</label>
                  <input {...register('name')} className="input" placeholder="Pastor João Silva" />
                  {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
                </div>
                <button type="button" onClick={nextStep} className="btn btn-primary w-full justify-center py-3 mt-2">
                  Continuar →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-base font-bold mb-4">Dados de Acesso</h2>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">E-mail *</label>
                  <input type="email" {...register('email')} className="input" placeholder="pastor@suaigreja.com" />
                  {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">Senha *</label>
                  <input type="password" {...register('password')} className="input" placeholder="Mínimo 8 caracteres" />
                  {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">Confirmar Senha *</label>
                  <input type="password" {...register('confirm')} className="input" placeholder="Repita a senha" />
                  {errors.confirm && <p className="text-xs text-danger mt-1">{errors.confirm.message}</p>}
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn btn-secondary flex-1 justify-center py-3">← Voltar</button>
                  <button type="submit" disabled={loading} className="btn btn-primary flex-1 justify-center py-3">
                    {loading ? 'Criando...' : 'Criar conta'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-secondary font-semibold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
